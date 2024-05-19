package com.dzalex.skillshuffle.services;

import com.dzalex.skillshuffle.dtos.PostAttachmentDTO;
import com.dzalex.skillshuffle.dtos.PostDTO;
import com.dzalex.skillshuffle.entities.Post;
import com.dzalex.skillshuffle.entities.PostAttachment;
import com.dzalex.skillshuffle.entities.User;
import com.dzalex.skillshuffle.entities.UserPostInteraction;
import com.dzalex.skillshuffle.enums.AttachmentType;
import com.dzalex.skillshuffle.enums.InteractionType;
import com.dzalex.skillshuffle.repositories.PostAttachmentRepository;
import com.dzalex.skillshuffle.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostAttachmentRepository postAttachmentRepository;

    @Autowired
    private FileService fileService;

    @Autowired
    private UserPostInteractionService userPostInteractionService;

    private UserService userService;

    @Autowired
    @Lazy
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    // Get user posts
    public List<PostDTO> getUserPosts(String nickname) {
        User user = userService.getUserByNickname(nickname);

        // Get all posts by user
        List<Post> posts = postRepository.findAllPostsByAuthorId(user.getId());

        // Get posts that reposted by user
        List<Post> repostedPosts = userPostInteractionService.getRepostedPosts(user.getId());

        // Add reposted posts to user posts
        posts.addAll(repostedPosts);

        // Convert posts to DTOs and set reposted flag
        return posts.stream()
                .peek(post -> {
                    UserPostInteraction interaction = userPostInteractionService.getPostWithRepostedInteraction(user.getId(), post.getId());
                    if (interaction != null) {
                        post.setCreatedAt(interaction.getCreatedAt());
                    }
                })
                .map(this::getPostDTO)
                .sorted((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt()))
                .toList();
    }

    // Create post
    public Post createPost(Post post, List<MultipartFile> files) {
        // Save post to database
        Post savedPost = postRepository.save(post);

        // Save photos to storage
        if (files != null) {
            savePostPhotos(savedPost, files);
        }

        return savedPost;
    }

    // Save post photos to storage
    private void savePostPhotos(Post post, List<MultipartFile> files) {
        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue;
            }

            // Save photo to storage
            String postPath = "users/" + post.getAuthor().getId() + "/posts/" + post.getId() + "/";
            String fileUrl = fileService.uploadFile(file, postPath);
            if (fileUrl != null) {
                // Save file to database
                PostAttachment postAttachment = new PostAttachment();
                postAttachment.setPost(post);
                postAttachment.setPhotoUrl(fileUrl);
                postAttachmentRepository.save(postAttachment);
            }
        }
    }

    // Like/unlike post
    public void likePost(Integer postId) {
        User user = userService.getCurrentUser();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        UserPostInteraction interaction = userPostInteractionService.getPostWithLikedInteraction(user.getId(), postId);
        if (interaction == null) {
            // Like post
            userPostInteractionService.createUserPostInteraction(user, post, InteractionType.LIKED);

            // Update post likes count
            post.setLikesCount(post.getLikesCount() + 1);
            postRepository.save(post);

            return;
        }

        // Unlike post
        userPostInteractionService.deleteUserPostInteraction(interaction);

        post.setLikesCount(post.getLikesCount() - 1);
        postRepository.save(post);
    }

    // Share post
    public void sharePost(Integer postId) {
        User user = userService.getCurrentUser();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        // Update post shares count
        post.setSharesCount(post.getSharesCount() + 1);
        postRepository.save(post);

        // Set post as REPOSTED
        userPostInteractionService.createUserPostInteraction(user, post, InteractionType.REPOSTED);
    }

    // Bookmark post
    public void bookmarkPost(Integer postId) {
        User user = userService.getCurrentUser();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        UserPostInteraction interaction = userPostInteractionService.getPostWithRepostedInteraction(user.getId(), postId);
        if (interaction == null) {
            // Bookmark post
            userPostInteractionService.createUserPostInteraction(user, post, InteractionType.BOOKMARKED);
            return;
        }

        // Remove from bookmarks
        userPostInteractionService.deleteUserPostInteraction(interaction);
    }

    // Get liked posts
    public List<PostDTO> getLikedPosts(String nickname) {
        User user = userService.getUserByNickname(nickname);
        return userPostInteractionService.getPostsWithLikedInteraction(user.getId()).stream()
                .map(this::getPostDTO)
                .toList();
    }

    // Get bookmarked posts
    public List<PostDTO> getBookmarkedPosts(String nickname) {
        User user = userService.getUserByNickname(nickname);
        return userPostInteractionService.getPostsWithBookmarkedInteraction(user.getId()).stream()
                .map(this::getPostDTO)
                .toList();
    }

    public int getUserPostsCount(User user) {
        return postRepository.countPostsByAuthorId(user.getId());
    }

    public int getUserLikedPostsCount(User user) {
        return userPostInteractionService.getPostsCountWithLikedInteraction(user.getId());
    }

    public int getUserBookmarkedPostsCount(User user) {
        return userPostInteractionService.getPostsCountWithBookmarkedInteraction(user.getId());
    }

    // Convert post to DTO
    public PostDTO getPostDTO(Post post) {
        User user = userService.getCurrentUser();
        List<PostAttachment> attachments = postAttachmentRepository.findPostAttachmentsByPostId(post.getId());
        return PostDTO.builder()
                .id(post.getId())
                .author(userService.getPublicUserDTO(post.getAuthor()))
                .text(post.getText())
                .privacy(post.getPrivacy())
                .likesCount(post.getLikesCount())
                .commentsCount(post.getCommentsCount())
                .sharesCount(post.getSharesCount())
                .liked(userPostInteractionService.isPostLikedByUser(post.getId(), user.getId()))
                .reposted(userPostInteractionService.isPostRepostedByUser(post.getId(), user.getId()) && !post.getAuthor().equals(user))
                .bookmarked(userPostInteractionService.isPostSavedByUser(post.getId(), user.getId()))
                .allowComments(post.isAllowComments())
                .allowNotifications(post.isAllowNotifications())
                .attachments(attachments.stream()
                        .map(postAttachment -> PostAttachmentDTO.builder()
                                .url(postAttachment.getPhotoUrl())
                                .type(AttachmentType.IMAGE)
                                .build())
                        .toList())
                .createdAt(post.getCreatedAt().toString())
                .updatedAt(post.getUpdatedAt().toString())
                .build();
    }
}

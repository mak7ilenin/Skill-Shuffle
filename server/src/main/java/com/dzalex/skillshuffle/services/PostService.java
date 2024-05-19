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
import org.springframework.transaction.annotation.Transactional;
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
    @Transactional
    public List<PostDTO> getUserPosts(Integer userId) {
        // Get all posts by user
        List<Post> posts = postRepository.findAllPostsByAuthorId(userId);

        // Get posts that reposted by user
        List<Post> repostedPosts = userPostInteractionService.getRepostedPosts(userId);

        // Add reposted posts to user posts
        posts.addAll(repostedPosts);

        // Convert posts to DTOs and set reposted flag
        return posts.stream()
                .map(post -> {
                    PostDTO postDTO = getPostDTO(post);
                    postDTO.setReposted(repostedPosts.contains(post));
                    return postDTO;
                })
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

        UserPostInteraction interaction = userPostInteractionService.getPostLikedInteraction(user.getId(), postId);
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

    // Convert post to DTO
    public PostDTO getPostDTO(Post post) {
        List<PostAttachment> attachments = postAttachmentRepository.findPostAttachmentsByPostId(post.getId());
        return PostDTO.builder()
                .id(post.getId())
                .author(userService.getPublicUserDTO(post.getAuthor()))
                .text(post.getText())
                .privacy(post.getPrivacy())
                .likesCount(post.getLikesCount())
                .commentsCount(post.getCommentsCount())
                .sharesCount(post.getSharesCount())
                .liked(userPostInteractionService.isPostLikedByUser(post.getId(), userService.getCurrentUser().getId()))
                .reposted(false)
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

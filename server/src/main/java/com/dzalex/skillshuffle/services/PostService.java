package com.dzalex.skillshuffle.services;

import com.dzalex.skillshuffle.dtos.PostDTO;
import com.dzalex.skillshuffle.entities.Post;
import com.dzalex.skillshuffle.entities.PostAttachment;
import com.dzalex.skillshuffle.entities.User;
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

    private UserService userService;

    @Autowired
    @Lazy
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    // Get user posts
    public List<PostDTO> getUserPosts(Integer userId) {
        List<Post> posts = postRepository.findPostsByAuthorId(userId);
        return posts.stream()
                .map(this::getPostDTO)
                .toList();
    }

    // Create post
    public Post createPost(Post post, List<MultipartFile> files) {
        // Save post to database
        Post savedPost = postRepository.save(post);

        // Save photos to storage
        savePostPhotos(savedPost, files);

        return savedPost;
    }

    // Save post photos to storage
    public void savePostPhotos(Post post, List<MultipartFile> files) {
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

    // Convert post to DTO
    public PostDTO getPostDTO(Post post) {
        List<PostAttachment> attachments = postAttachmentRepository.findPostAttachmentsByPostId(post.getId());
        return PostDTO.builder()
                .id(post.getId())
                .author(userService.getPublicUserDTO(post.getAuthor()))
                .text(post.getText())
                .privacy(post.getPrivacy())
                .allowComments(post.isAllowComments())
                .allowNotifications(post.isAllowNotifications())
                .attachments(attachments)
                .createdAt(post.getCreatedAt().toString())
                .updatedAt(post.getUpdatedAt().toString())
                .build();
    }
}

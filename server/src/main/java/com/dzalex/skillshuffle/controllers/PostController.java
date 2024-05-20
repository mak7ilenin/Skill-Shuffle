package com.dzalex.skillshuffle.controllers;

import com.dzalex.skillshuffle.dtos.PostDTO;
import com.dzalex.skillshuffle.entities.Post;
import com.dzalex.skillshuffle.services.PostService;
import com.dzalex.skillshuffle.services.UserPostInteractionService;
import com.dzalex.skillshuffle.services.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private UserService userService;

    // Get user posts
    @GetMapping("/posts")
    public List<PostDTO> getUserPosts(@RequestParam("nickname") String nickname) {
        return postService.getUserPosts(nickname);
    }

    // Create post
    @PostMapping("/posts")
    public Post createPost(@RequestParam("post") String postObject,
                           @RequestParam(required = false, name = "files") List<MultipartFile> files) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        Post post = mapper.readValue(postObject, Post.class);
        post.setAuthor(userService.getCurrentUser());

        return postService.createPost(post, files);
    }

    // Delete post
    @DeleteMapping("/posts/{postId}")
    public void deletePost(@PathVariable Integer postId) {
        postService.deletePost(postId);
    }

    // Like post
    @PostMapping("/posts/{postId}/like")
    public void likePost(@PathVariable Integer postId) {
        postService.likePost(postId);
    }

    // Share post
    @PostMapping("/posts/{postId}/share")
    public void sharePost(@PathVariable Integer postId) {
        postService.sharePost(postId);
    }

    // Bookmark post
    @PostMapping("/posts/{postId}/bookmark")
    public void bookmarkPost(@PathVariable Integer postId) {
        postService.bookmarkPost(postId);
    }

    // Get liked posts
    @GetMapping("/posts/liked")
    public List<PostDTO> getLikedPosts(@RequestParam("nickname") String nickname) {
        return postService.getLikedPosts(nickname);
    }

    // Get bookmarked posts
    @GetMapping("/posts/bookmarked")
    public List<PostDTO> getBookmarkedPosts(@RequestParam("nickname") String nickname) {
        return postService.getBookmarkedPosts(nickname);
    }
}

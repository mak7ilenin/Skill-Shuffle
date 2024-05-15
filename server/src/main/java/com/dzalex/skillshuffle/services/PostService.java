package com.dzalex.skillshuffle.services;

import com.dzalex.skillshuffle.entities.Post;
import com.dzalex.skillshuffle.entities.User;
import com.dzalex.skillshuffle.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    // Get user posts
    public List<Post> getUserPosts(User user) {
        return postRepository.findPostsByUserId(user.getId());
    }
}

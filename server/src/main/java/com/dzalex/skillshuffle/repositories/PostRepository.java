package com.dzalex.skillshuffle.repositories;

import com.dzalex.skillshuffle.entities.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Integer> {
    Post findPostById(Integer id);
    void deletePostById(Integer id);
    List<Post> findPostsByAuthorId(Integer userId);
}

package com.dzalex.skillshuffle.repositories;

import com.dzalex.skillshuffle.entities.PostAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostAttachmentRepository extends JpaRepository<PostAttachment, Integer> {
    List<PostAttachment> findPostAttachmentsByPostId(Integer postId);
}

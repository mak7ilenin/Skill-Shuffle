package com.dzalex.skillshuffle.controllers;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController("/uploaded-files")
public class FileController {

    private final String avatarsDirectory;

    public FileController() {
        this.avatarsDirectory = getResourceDirectory();
    }

    @GetMapping("/avatars/{filename:.+}")
    public ResponseEntity<Resource> serveAvatar(@PathVariable String filename) {
        try {
            Path avatarPath = Paths.get(avatarsDirectory, filename);
            Resource avatar = new UrlResource(avatarPath.toUri());

            if (avatar.exists() || avatar.isReadable()) {
                return ResponseEntity.ok().body(avatar);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.notFound().build();
        }
    }

    private String getResourceDirectory() {
        String userDir = System.getProperty("user.dir");
        return userDir + "/src/main/resources/uploaded-files/avatars/";
    }
}
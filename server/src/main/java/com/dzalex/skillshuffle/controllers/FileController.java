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

@RestController
public class FileController {

    @GetMapping("/{category}/{id}/{subCategory}/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String category,
                                              @PathVariable String id,
                                              @PathVariable String subCategory,
                                              @PathVariable String filename) {
        try {
            // Construct the file path based on the provided parameters
            String filePath = String.format("%s/%s/%s/%s/%s", getResourceDirectory(), category, id, subCategory, filename);
            Path file = Paths.get(filePath);
            Resource resource = new UrlResource(file.toUri());

            // Check if the file exists and is readable
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok().body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.notFound().build();
        }
    }

    private String getResourceDirectory() {
        // String userDir = System.getProperty("user.dir");
        // return userDir + "/src/main/resources/uploads/";
        return "/app/uploads/";
    }
}
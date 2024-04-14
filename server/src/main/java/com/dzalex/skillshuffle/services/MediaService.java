package com.dzalex.skillshuffle.services;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class MediaService {

    private static final String MEDIA_PATH = "src/main/resources/static/";

    public String uploadImage(MultipartFile file, String path) throws IOException {
        // Generate a unique file name
        String fileName = UUID.randomUUID() + "." + StringUtils.getFilenameExtension(file.getOriginalFilename());

        // Define the target directory
        Path targetDirectory = Paths.get(MEDIA_PATH, path);

        // Create the directory if it doesn't exist
        Files.createDirectories(targetDirectory);

        // Construct the full file path
        Path targetFile = targetDirectory.resolve(fileName);

        // Save the file to the target directory
        Files.copy(file.getInputStream(), targetFile, StandardCopyOption.REPLACE_EXISTING);

        // Return the URL of the uploaded image
        return fileName;
    }
}

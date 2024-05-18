package com.dzalex.skillshuffle.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;
import java.util.Date;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileService {
    private static final Logger log = LoggerFactory.getLogger(FileService.class);

    @Autowired
    private S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    public String uploadFile(MultipartFile multipartFile, String path) {
        try {
            File file = convertMultiPartFileToFile(multipartFile);
            String fileName = generateFileName();
            uploadFileToS3Bucket(fileName, file, path);
            file.delete();
            return getFileUrlFromS3Bucket(path + fileName);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error uploading file");
        }
    }

    public String changeFile(MultipartFile multipartFile, String path, String oldUrl) {
        try {
            String oldKey = extractKeyFromUrl(oldUrl);
            deleteFileFromS3Bucket(oldKey);
            return uploadFile(multipartFile, path);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error changing file");
        }
    }

    private void deleteFileFromS3Bucket(String key) {
        try {
            s3Client.deleteObject(builder -> builder.bucket(bucketName).key(key));
        } catch (Exception e) {
            throw new IllegalArgumentException("Error deleting file from S3 bucket");
        }
    }

    private void uploadFileToS3Bucket(String fileName, File file, String path) {
        s3Client.putObject(PutObjectRequest.builder()
                .bucket(bucketName)
                .key(path + fileName)
                .build(), RequestBody.fromFile(file));
    }

    private String getFileUrlFromS3Bucket(String key) {
        GetUrlRequest getUrlRequest = GetUrlRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        URL url = s3Client.utilities().getUrl(getUrlRequest);
        return url.toString();
    }

    public String extractKeyFromUrl(String url) {
        String bucketUrl = "https://skill-shuffle.s3.eu-north-1.amazonaws.com/";
        if (url.startsWith(bucketUrl)) {
            return url.substring(bucketUrl.length());
        } else {
            throw new IllegalArgumentException("URL does not start with the expected bucket URL");
        }
    }

    private File convertMultiPartFileToFile(MultipartFile file) {
        File convertedFile = new File(Objects.requireNonNull(file.getOriginalFilename()));
        try (FileOutputStream fos = new FileOutputStream(convertedFile)) {
            fos.write(file.getBytes());
        } catch (IOException e) {
            log.error("Error converting multipartFile to file", e);
        }
        return convertedFile;
    }

    private String generateFileName() {
        return new Date().getTime() + "-" + UUID.randomUUID();
    }
}
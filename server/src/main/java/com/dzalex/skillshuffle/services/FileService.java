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
            String fileName = generateFileName(multipartFile);
            uploadFileToS3Bucket(fileName, file, path);
            file.delete();
            return getFileUrlFromS3Bucket(path + fileName);
        } catch (Exception e) {
            log.error("Error uploading file", e);
            return null;
        }
    }

    private void uploadFileToS3Bucket(String fileName, File file, String path) {
        s3Client.putObject(PutObjectRequest.builder()
                .bucket(bucketName)
                .key(path + fileName)
                .build(), RequestBody.fromFile(file));
    }

    public String getFileUrlFromS3Bucket(String key) {
        GetUrlRequest getUrlRequest = GetUrlRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        URL url = s3Client.utilities().getUrl(getUrlRequest);
        return url.toString();
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

    private String generateFileName(MultipartFile multiPart) {
        return new Date().getTime() + "-" + UUID.randomUUID() + "-" + multiPart.getOriginalFilename().replace(" ", "_");
    }
}
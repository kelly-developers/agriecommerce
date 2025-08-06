package com.example.agriecommerce.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.Set;
import java.util.UUID;

@Service
public class ImageStorageService {

    @Value("${upload.directory}")
    private String uploadDirectory;

    public String store(MultipartFile file) throws IOException {
        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Validate file type
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
        if (!Set.of(".jpg", ".jpeg", ".png", ".gif").contains(extension)) {
            throw new IllegalArgumentException("Only JPG, JPEG, PNG, GIF images are allowed");
        }

        // Create directory (with retry logic for Render)
        Path uploadPath = Paths.get(uploadDirectory);
        try {
            Files.createDirectories(uploadPath);
        } catch (FileAlreadyExistsException e) {
            // Directory already exists, ignore
        }

        // Generate filename
        String uniqueFilename = UUID.randomUUID() + extension;
        Path filePath = uploadPath.resolve(uniqueFilename);

        // Save with atomic move
        Path tempFile = Files.createTempFile("upload-", extension);
        try {
            file.getInputStream().transferTo(Files.newOutputStream(tempFile));
            Files.move(tempFile, filePath, StandardCopyOption.ATOMIC_MOVE);
        } finally {
            Files.deleteIfExists(tempFile);
        }

        return "/uploads/" + uniqueFilename;
    }
}
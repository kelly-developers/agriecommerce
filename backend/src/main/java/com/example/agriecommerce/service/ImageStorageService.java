package com.example.agriecommerce.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.Set;
import java.util.UUID;
import java.util.logging.Logger;

@Service
public class ImageStorageService {
    private static final Logger logger = Logger.getLogger(ImageStorageService.class.getName());

    @Value("${upload.directory}")
    private String uploadDirectory;

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(".jpg", ".jpeg", ".png", ".gif", ".webp");
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    public String store(MultipartFile file) throws IOException {
        // Validate file
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty or null");
        }

        // Validate file size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds maximum limit of 5MB");
        }

        // Validate file type
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.lastIndexOf(".") == -1) {
            throw new IllegalArgumentException("File has no extension");
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("Only JPG, JPEG, PNG, GIF, WEBP images are allowed");
        }

        // Create directory with proper permissions
        Path uploadPath = Paths.get(uploadDirectory);
        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                logger.info("Created upload directory: " + uploadPath);

                try {
                    uploadPath.toFile().setReadable(true, false);
                    uploadPath.toFile().setExecutable(true, false);
                } catch (SecurityException e) {
                    logger.warning("Could not set directory permissions: " + e.getMessage());
                }
            }
        } catch (IOException e) {
            logger.severe("Failed to create upload directory: " + e.getMessage());
            throw new IOException("Failed to create upload directory", e);
        }

        // Generate unique filename
        String uniqueFilename = UUID.randomUUID() + extension;
        Path filePath = uploadPath.resolve(uniqueFilename);

        try {
            // Save file directly
            file.transferTo(filePath.toFile());

            // Set file permissions
            try {
                filePath.toFile().setReadable(true, false);
            } catch (SecurityException e) {
                logger.warning("Could not set file permissions: " + e.getMessage());
            }

            logger.info("Successfully stored file: " + filePath);

            // Return relative path
            return "/uploads/" + uniqueFilename;
        } catch (IOException e) {
            logger.severe("Failed to store file: " + e.getMessage());
            throw new IOException("Failed to store file", e);
        }
    }

    public void delete(String filename) throws IOException {
        if (filename == null || filename.isEmpty()) {
            throw new IllegalArgumentException("Filename cannot be empty");
        }

        Path filePath = Paths.get(uploadDirectory, filename);
        try {
            Files.deleteIfExists(filePath);
            logger.info("Deleted file: " + filePath);
        } catch (IOException e) {
            logger.severe("Failed to delete file: " + e.getMessage());
            throw new IOException("Failed to delete file", e);
        }
    }
}
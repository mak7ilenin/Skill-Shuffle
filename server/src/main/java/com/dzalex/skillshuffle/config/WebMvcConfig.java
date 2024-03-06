package com.dzalex.skillshuffle.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String resourceDir = getResourceDirectory();
        registry.addResourceHandler("/uploaded-files/**").addResourceLocations("file:///" + resourceDir);
    }

    private String getResourceDirectory() {
        String userDir = System.getProperty("user.dir");
        return userDir + "/src/main/resources/uploaded-files/";
    }
}
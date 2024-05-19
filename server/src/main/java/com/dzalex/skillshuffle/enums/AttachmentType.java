package com.dzalex.skillshuffle.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum AttachmentType {
    @JsonProperty("image")
    IMAGE,
    @JsonProperty("video")
    VIDEO,
    @JsonProperty("audio")
    AUDIO,
    @JsonProperty("file")
    FILE
}

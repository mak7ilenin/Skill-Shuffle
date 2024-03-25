package com.dzalex.skillshuffle.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum MessageType {
    @JsonProperty("text")
    TEXT,
    @JsonProperty("gif")
    GIF,
}

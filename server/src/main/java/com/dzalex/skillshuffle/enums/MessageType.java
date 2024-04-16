package com.dzalex.skillshuffle.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum MessageType {
    @JsonProperty("announcement")
    ANNOUNCEMENT,
    @JsonProperty("message")
    MESSAGE,
    @JsonProperty("entry")
    ENTRY
}

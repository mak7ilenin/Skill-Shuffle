package com.dzalex.skillshuffle.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum MessageStatus {
    @JsonProperty("sent")
    SENT,
    @JsonProperty("delivered")
    DELIVERED,
    @JsonProperty("read")
    READ
}

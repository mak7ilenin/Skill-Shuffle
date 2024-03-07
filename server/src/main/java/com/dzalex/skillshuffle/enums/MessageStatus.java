package com.dzalex.skillshuffle.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum MessageStatus {
    @JsonProperty("received")
    RECEIVED,
    @JsonProperty("delivered")
    DELIVERED,
    @JsonProperty("read")
    READ
}

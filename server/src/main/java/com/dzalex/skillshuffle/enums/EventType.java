package com.dzalex.skillshuffle.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum EventType {
    @JsonProperty("webinar")
    WEBINAR,
    @JsonProperty("competition")
    COMPETITION,
}

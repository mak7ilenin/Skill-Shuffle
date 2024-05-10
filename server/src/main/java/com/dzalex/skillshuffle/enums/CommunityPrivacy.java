package com.dzalex.skillshuffle.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum CommunityPrivacy {
    @JsonProperty("open")
    OPEN,
    @JsonProperty("closed")
    CLOSED,
    @JsonProperty("private")
    PRIVATE
}

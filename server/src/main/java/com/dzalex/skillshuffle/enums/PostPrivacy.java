package com.dzalex.skillshuffle.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum PostPrivacy {
    @JsonProperty("public")
    PUBLIC,
    @JsonProperty("friends")
    FRIENDS
}

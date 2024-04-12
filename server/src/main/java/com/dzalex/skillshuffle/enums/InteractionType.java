package com.dzalex.skillshuffle.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum InteractionType {
    @JsonProperty("bookmarked")
    BOOKMARKED,
    @JsonProperty("liked")
    LIKED,
}

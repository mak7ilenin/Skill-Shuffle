package com.dzalex.skillshuffle.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum ChatType {
    @JsonProperty("private")
    PRIVATE,
    @JsonProperty("community")
    COMMUNITY,
    @JsonProperty("group")
    GROUP
}

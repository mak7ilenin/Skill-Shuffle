package com.dzalex.skillshuffle.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum RelationshipStatus {
    @JsonProperty("follower")
    FOLLOWER,
    @JsonProperty("following")
    FOLLOWING,
    @JsonProperty("friend")
    FRIEND,
    @JsonProperty("none")
    NONE
}

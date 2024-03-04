package com.dzalex.skillshuffle.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum MemberRole {
    @JsonProperty("admin")
    ADMIN,
    @JsonProperty("moderator")
    MODERATOR,
    @JsonProperty("member")
    MEMBER
}

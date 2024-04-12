package com.dzalex.skillshuffle.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum  MemberRole {
    @JsonProperty("creator")
    CREATOR,
    @JsonProperty("admin")
    ADMIN,
    @JsonProperty("member")
    MEMBER
}

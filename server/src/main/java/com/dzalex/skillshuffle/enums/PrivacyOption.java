package com.dzalex.skillshuffle.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum PrivacyOption {
    @JsonProperty("all_users")
    ALL_USERS,
    @JsonProperty("friends_only")
    FRIENDS_ONLY,
    @JsonProperty("no_one")
    NO_ONE,
    @JsonProperty("only_me")
    ONLY_ME;
}

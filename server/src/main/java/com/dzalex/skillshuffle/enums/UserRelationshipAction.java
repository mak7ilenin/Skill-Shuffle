package com.dzalex.skillshuffle.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum UserRelationshipAction {
    @JsonProperty("follow")
    FOLLOW,
    @JsonProperty("unfollow")
    UNFOLLOW,
    @JsonProperty("add_friend")
    ADD_FRIEND,
    @JsonProperty("unfriend")
    UNFRIEND,
    @JsonProperty("remove_follower")
    REMOVE_FOLLOWER
}

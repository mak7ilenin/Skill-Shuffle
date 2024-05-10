package com.dzalex.skillshuffle.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum FriendRequestStatus {
    @JsonProperty("pending")
    PENDING,
    @JsonProperty("accepted")
    ACCEPTED,
    @JsonProperty("rejected")
    REJECTED,
    @JsonProperty("ignored")
    IGNORED
}

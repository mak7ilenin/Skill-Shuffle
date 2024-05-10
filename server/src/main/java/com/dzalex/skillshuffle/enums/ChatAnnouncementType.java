package com.dzalex.skillshuffle.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum ChatAnnouncementType {
    @JsonProperty("left")
    LEFT,
    @JsonProperty("removed")
    REMOVED,
    @JsonProperty("created")
    CREATED,
    @JsonProperty("added")
    ADDED,
    @JsonProperty("returned")
    RETURNED
}

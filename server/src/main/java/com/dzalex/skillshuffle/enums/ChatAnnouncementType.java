package com.dzalex.skillshuffle.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum ChatAnnouncementType {
    @JsonProperty("joined")
    JOINED,
    @JsonProperty("left")
    LEFT,
    @JsonProperty("kicked")
    KICKED,
    @JsonProperty("created")
    CREATED,
    @JsonProperty("invited")
    INVITED
}

package com.dzalex.skillshuffle.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum BirthdayVisibility {
    @JsonProperty("do_not_show")
    DO_NOT_SHOW,
    @JsonProperty("month_and_day")
    MONTH_AND_DAY,
    @JsonProperty("full_birthday")
    FULL_BIRTHDAY;
}

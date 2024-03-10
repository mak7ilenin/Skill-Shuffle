package com.dzalex.skillshuffle.services;

import com.dzalex.skillshuffle.models.User;
import com.dzalex.skillshuffle.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    public boolean checkUserDuplicate(String username, String email) {
        User user = userRepo.findByUsername(username);
        User userByEmail = userRepo.findByEmail(email);
        return user != null || userByEmail != null;
    }

    public User saveUser(User user) {
        user.setPassword(passwordEncoder().encode(user.getPassword()));
        return userRepo.save(user);
    }
}

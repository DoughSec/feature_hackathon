package com.taskboard.config;

import com.taskboard.model.Task;
import com.taskboard.model.TaskStatus;
import com.taskboard.model.User;
import com.taskboard.repository.TaskRepository;
import com.taskboard.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, TaskRepository taskRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        User alice = createUser("Alice Johnson", "alice@taskboard.com", "password123");
        User bob = createUser("Bob Smith", "bob@taskboard.com", "password123");
        User carol = createUser("Carol Davis", "carol@taskboard.com", "password123");

        createTask("Set up project repository",
                "Initialize Git repo, add .gitignore, and create initial project structure with Maven and React.",
                TaskStatus.DONE, "LOW", alice.getName());

        createTask("Design database schema",
                "Create ER diagram and define table structures for users, tasks, and relationships.",
                TaskStatus.DONE, "LOW", bob.getName());

        createTask("Create REST API endpoints",
                "Implement CRUD endpoints for the task resource with proper validation and error handling.",
                TaskStatus.IN_PROGRESS, "HIGH", alice.getName());

        createTask("Build login page",
                "Create a responsive login form with email and password fields, including error display.",
                TaskStatus.IN_PROGRESS, "MEDIUM", carol.getName());

        createTask("Write unit tests",
                "Add JUnit tests for the service layer and integration tests for controller endpoints.",
                TaskStatus.TODO, "MEDIUM", bob.getName());

        createTask("Set up CI/CD pipeline",
                "Configure GitHub Actions for automated testing on pull requests and deployment on merge.",
                TaskStatus.TODO, "HIGH", alice.getName());

        createTask("Create user documentation",
                "Write a user guide covering all features, common workflows, and troubleshooting tips.",
                TaskStatus.TODO, "LOW", carol.getName());

        createTask("Code review sprint 1",
                "Review all pull requests from sprint 1, leave constructive feedback, and approve for merge.",
                TaskStatus.TODO, "LOW", bob.getName());
    }

    private User createUser(String name, String email, String rawPassword) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        return userRepository.save(user);
    }

    private void createTask(String title, String description, TaskStatus status, String priority, String createdBy) {
        Task task = new Task();
        task.setTitle(title);
        task.setDescription(description);
        task.setStatus(status);
        task.setPriority(priority);
        task.setCreatedBy(createdBy);
        taskRepository.save(task);
    }
}

# Chad backend

## Docker Setup

1. Build the image:
    ```bash
    cd chad
    docker-compose up --build
    ```

2. Run the container:
    ```bash
    docker exec -it chad-docker /bin/bash
    ```

## test action agent locally on terminal:

```bash
cd chad
python -m backend.function.agents.action_combined_agent
```


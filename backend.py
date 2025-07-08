from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, Session, SQLModel, create_engine, select
from typing import Optional, List

# 🎯 Create the FastAPI app
app = FastAPI()

# 🌐 Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with your IP if running on LAN
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🗃️ SQLModel - Task Table Model
class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    completed: bool = False

# 🛠️ Database Setup
sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
engine = create_engine(sqlite_url, echo=True)

# ✅ Create tables on startup
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# 📥 Add Task
@app.post("/tasks", response_model=Task)
def add_task(task: Task):
    with Session(engine) as session:
        session.add(task)
        session.commit()
        session.refresh(task)
        return task

# 📋 Get All Tasks
@app.get("/tasks", response_model=List[Task])
def get_tasks():
    with Session(engine) as session:
        tasks = session.exec(select(Task)).all()
        return tasks

# 🛠️ Update Task
@app.put("/tasks/{task_id}")
def update_task(task_id: int, updated_task: Task):
    with Session(engine) as session:
        task = session.get(Task, task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        task.title = updated_task.title
        task.description = updated_task.description
        task.completed = updated_task.completed
        session.commit()
        return {"message": "Task updated"}

# ❌ Delete Task
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    with Session(engine) as session:
        task = session.get(Task, task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        session.delete(task)
        session.commit()
        return {"message": "Task deleted"}

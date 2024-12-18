import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import moment from "moment";
import { taskStatusRadioLabels } from "./constant";

const AddEditTaskModal = ({
  taskInfo,
  setTaskInfo,
  closeModal,
  editData,
  onConfirm,
  isLoading,
  viewTask,
}) => {
  useEffect(() => {
    if (!editData && !viewTask) return;
    const taskInfo = {
      title: viewTask?.title || editData?.title,
      description: viewTask?.description || editData?.description,
      status: viewTask?.status || editData?.status,
    };
    setTaskInfo(taskInfo);
  }, []);

  return (
    <>
      <Modal
        show={true}
        centered={"true"}
        animation={true}
        dialogClassName="modal-500px"
      >
        <Modal.Header className="border-bottom-1 border-gray-100 py-25 mb-15">
          <h4 className="modal-title" id="myModalLabel">
            {editData ? "Edit Task" : viewTask ? "Task Details" : "New Task"}
          </h4>
        </Modal.Header>
        <Modal.Body className="pb-15">
          <div className="form-group">
            <label className="form-label">
              <span className="text-danger">*</span> Title
            </label>
            <input
              type="text"
              disabled={viewTask}
              className="form-control"
              placeholder="Enter task title"
              value={taskInfo?.title}
              onChange={(e) => {
                setTaskInfo((oldVal) => {
                  return { ...oldVal, title: e?.target?.value };
                });
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="text-danger">*</span> Description
            </label>
            <input
              type="text"
              disabled={viewTask}
              className="form-control"
              placeholder="Enter task description"
              value={taskInfo?.description}
              onChange={(e) => {
                setTaskInfo((oldVal) => {
                  return { ...oldVal, description: e?.target?.value };
                });
              }}
            />
          </div>
          {viewTask && (
            <div className="form-group mt-2">
              <label className="form-label">Created at</label>{" "}
              <span>
                {moment(viewTask?.createdAt).format("DD/MM/YYYY, HH:mm:ss")}
              </span>
            </div>
          )}
          <div className="form-group mt-2">
            <label className="form-label font-14">
              <span className="text-danger">*</span> Task Status
            </label>
            <div className="d-flex">
              {taskStatusRadioLabels.map((val, index) => (
                <div className="form-check mr-2" key={index}>
                  <input
                    disabled={viewTask}
                    className={`form-check-input`}
                    type="radio"
                    id={val}
                    name={val}
                    checked={taskInfo?.status === val}
                    onChange={(e) => {
                      setTaskInfo((oldVal) => {
                        return { ...oldVal, status: e?.target?.name };
                      });
                    }}
                  />
                  <label className="form-check-label" htmlFor={val}>
                    {val}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-close"
            onClick={closeModal}
          ></button>
          {!viewTask && (
            <button
              disabled={isLoading}
              type="button"
              onClick={() => onConfirm(editData?._id || "")}
              className="btn btn-primary"
            >
              {isLoading && (
                <span
                  className="spinner-border spinner-border-sm mr-2"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              {`${editData ? "Edit" : "Add"} Task`}
            </button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddEditTaskModal;

import React, { useState, useEffect } from "react";
import { Table, Thead, Tbody, Tr, Td, Th } from "@strapi/design-system/Table";
import {
  Box,
  Typography,
  BaseCheckbox,
  Alert,
  Loader,
  Flex,
  IconButton,
  Link,
} from "@strapi/design-system";
import { Pencil, Trash, Plus } from "@strapi/icons";
import axios from "../utils/axiosInstance";
import ConfirmationDialog from "./ConfirmationDialog";
import BulkActions from "./BulkActions";
import { useIntl } from "react-intl";
import getTrad from "../utils/getTrad";

const COL_COUNT = 5;

const Repo = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRepos, setSelectedRepos] = useState([]);
  const [alert, setAlert] = useState(undefined);
  const [deletingProjectId, setDeletingProjectId] = useState(undefined);
  const { formatMessage } = useIntl();

  const showAlert = (alert) => {
    setAlert(alert);
    setTimeout(() => {
      setAlert(undefined);
    }, 5000);
  };

  const createProject = async (repo) => {
    try {
      const response = await axios.post("/github-projects/project", repo);
      if (response && response.data) {
        setRepos(
          repos.map((item) =>
            item.id !== repo.id
              ? item
              : {
                  ...item,
                  projectId: response.data.id,
                }
          )
        );

        showAlert({
          title: "Project created",
          message: "Project was created successfully",
          variant: "success",
        });
      }
    } catch (error) {
      showAlert({
        title: "An error occurred",
        message: "Project was NOT created. Retry again later.",
        variant: "danger",
      });
    }
  };

  const deleteProject = async (repoId) => {
    try {
      const response = await axios.delete(`/github-projects/project/${repoId}`);
      repos.map((repo) =>
        repo.projectId !== repoId ? repo : (repo.projectId = undefined)
      );

      showAlert({
        title: "Project deleted",
        message: "Project was deleted successfully",
        variant: "success",
      });
    } catch (error) {
      showAlert({
        title: "An error occurred",
        message: "Project was NOT deleted. Retry again later.",
        variant: "danger",
      });
    }
  };

  const createManyProjects = async (projectsToCreate) => {
    try {
      const response = await axios.post(
        "/github-projects/projects",
        projectsToCreate
      );

      repos.map((repo) =>
        setRepos(
          repos.map((repo) => {
            const repoReference = response.data.find(
              (project) => repo.id == project.repositoryId
            );
            return !repo.projectId && repoReference
              ? {
                  ...repo,
                  projectId: repoReference.id,
                }
              : repo;
          })
        )
      );

      showAlert({
        title: "Projects created",
        message: "All projects were created successfully",
        variant: "success",
      });
    } catch (error) {
      showAlert({
        title: "An error occurred",
        message: "At least one project was NOT created. Retry again later.",
        variant: "danger",
      });
    } finally {
      setSelectedRepos([]);
    }
  };

  const deleteManyProject = async (projectIds) => {
    try {
      const response = await axios.delete(`/github-projects/projects`, {
        params: {
          projectIds,
        },
      });

      repos.map((repo) =>
        setRepos(
          repos.map((repo) => {
            const repoReference = response.data.find(
              (project) => repo.id == project.repositoryId
            );
            return repoReference
              ? {
                  ...repo,
                  projectId: undefined,
                }
              : repo;
          })
        )
      );

      showAlert({
        title: "Project deleted",
        message: "Project was deleted successfully",
        variant: "success",
      });
    } catch (error) {
      showAlert({
        title: "An error occurred",
        message: "Project was NOT deleted. Retry again later.",
        variant: "danger",
      });
    } finally {
      setSelectedRepos([]);
    }
  };

  useEffect(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/github-projects/repos");
      setRepos(response.data);
    } catch (error) {
      showAlert({
        title: "Fetching repository error",
        message: error.toString(),
        variant: "danger",
      });
    }
    setLoading(false);
  }, []);

  if (loading) return <Loader>Loading...</Loader>;

  const allChecked = selectedRepos.length == repos.length;
  const isIndeterminate = selectedRepos.length > 0 && !allChecked;

  return (
    <Box padding={8} background="neutral100">
      {alert && (
        <div style={{ position: "absolute", top: 0, left: "14%", zIndex: 10 }}>
          <Alert
            closeLabel="Close alert"
            title={alert.title}
            variant={alert.variant}
          >
            {alert.message}
          </Alert>
        </div>
      )}
      {selectedRepos.length > 0 && (
        <BulkActions
          selectedRepos={selectedRepos.map((repoId) =>
            repos.find((repo) => repo.id == repoId)
          )}
          createProjectsInBulk={createManyProjects}
          deleteProjectsInBulk={deleteManyProject}
        />
      )}
      <Table colCount={COL_COUNT} rowCount={repos.length}>
        <Thead>
          <Tr>
            <Th>
              <BaseCheckbox
                aria-label="Select all entries"
                value={allChecked}
                indeterminate={isIndeterminate}
                onValueChange={(value) =>
                  value
                    ? setSelectedRepos(repos.map((repo) => repo.id))
                    : setSelectedRepos([])
                }
              />
            </Th>
            <Th>
              <Typography variant="sigma">
                {formatMessage({
                  id: getTrad("repo.name"),
                  defaultMessage: "Name",
                })}
              </Typography>
            </Th>
            <Th>
              <Typography variant="sigma">
                {formatMessage({
                  id: getTrad("repo.description"),
                  defaultMessage: "Description",
                })}
              </Typography>
            </Th>
            <Th>
              <Typography variant="sigma">
                {formatMessage({
                  id: getTrad("repo.url"),
                  defaultMessage: "Url",
                })}
              </Typography>
            </Th>
            <Th>
              <Typography variant="sigma">
                {formatMessage({
                  id: getTrad("repo.actions"),
                  defaultMessage: "Actions",
                })}
              </Typography>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {repos.map((repo) => {
            const { id, name, shortDescription, url, projectId } = repo;
            return (
              <Tr key={id}>
                <Td>
                  <BaseCheckbox
                    aria-label={`Select ${id}`}
                    value={selectedRepos.includes(id)}
                    onValueChange={(value) => {
                      const tempSelectedRepos = value
                        ? [...selectedRepos, id]
                        : selectedRepos.filter((repoId) => repoId != id);
                      setSelectedRepos(tempSelectedRepos);
                    }}
                  />
                </Td>
                <Td>
                  <Typography textColor="neutral800">{name}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">
                    {shortDescription}
                  </Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">
                    <Link href={url} isExternal>
                      {url}
                    </Link>
                  </Typography>
                </Td>
                <Td>
                  {projectId ? (
                    <Flex>
                      <Link
                        to={`/content-manager/collectionType/plugin::github-projects.project/${projectId}`}
                      >
                        <IconButton
                          onClick={() => console.log("edit")}
                          label="Edit"
                          noBorder
                          icon={<Pencil />}
                        />
                      </Link>
                      <Box paddingLeft={1}>
                        <IconButton
                          onClick={() => setDeletingProjectId(repo.projectId)}
                          label="Delete"
                          noBorder
                          icon={<Trash />}
                        />
                      </Box>
                    </Flex>
                  ) : (
                    <IconButton
                      onClick={() => createProject(repo)}
                      label="Add"
                      noBorder
                      icon={<Plus />}
                    />
                  )}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      {deletingProjectId && (
        <ConfirmationDialog
          onClose={() => setDeletingProjectId(undefined)}
          message="Are you sure you want to delete this project"
          onConfirm={() => deleteProject(deletingProjectId)}
          visible={!!deletingProjectId}
        />
      )}
    </Box>
  );
};

export default Repo;

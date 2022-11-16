import React, { useState } from "react";
import { Box, Flex, Button, Typography } from "@strapi/design-system";
import { Plus, Trash } from "@strapi/icons";
import ConfirmationDialog from "./ConfirmationDialog";

const BulkActions = ({
  selectedRepos,
  createProjectsInBulk,
  deleteProjectsInBulk,
}) => {
  const reposWithProject = selectedRepos.filter((repo) => repo.projectId);
  const reposWithoutProject = selectedRepos.filter((repo) => !repo.projectId);
  const projectsToBeCreated = reposWithoutProject.length;
  const projectsToBeDeleted = reposWithProject.length;
  const projectIds = reposWithProject.map((repo) => repo.projectId);
  const [dialogVisible, setDialogVisible] = useState(false);

  return (
    <Box padding={4}>
      <Flex>
        <Typography textColor="neutral800">
          {`You have ${projectsToBeCreated} projects to create and ${projectsToBeDeleted} projects to
          delete.`}
        </Typography>
        {projectsToBeCreated > 0 && (
          <Box paddingLeft={1}>
            <Button
              size="S"
              variant="success-light"
              startIcon={<Plus />}
              onClick={() => {
                createProjectsInBulk(reposWithoutProject);
              }}
            >{`Create ${projectsToBeCreated} project(s)`}</Button>
          </Box>
        )}
        {projectsToBeDeleted > 0 && (
          <Box paddingLeft={1}>
            <Button
              size="S"
              variant="danger-light"
              startIcon={<Trash />}
              onClick={() => setDialogVisible(true)}
            >{`Delete ${projectsToBeDeleted} project(s)`}</Button>
          </Box>
        )}
      </Flex>
      <ConfirmationDialog
        visible={dialogVisible}
        message="Are you sure you want to delete these projects."
        onClose={() => setDialogVisible(false)}
        onConfirm={() => deleteProjectsInBulk(projectIds)}
      />
    </Box>
  );
};

export default BulkActions;

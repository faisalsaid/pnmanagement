import { Prisma } from '@prisma/client';

export const projectDetailQuery = Prisma.validator<Prisma.ProjectDefaultArgs>()(
  {
    include: {
      members: {
        select: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              image: true,
              name: true,
            },
          },
          role: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          email: true,
          role: true,
          image: true,
          name: true,
        },
      },
      goals: {
        include: {
          tasks: {
            include: {
              goal: {
                select: {
                  title: true,
                },
              },
              assignedTo: {
                include: {
                  teamMemberships: {
                    select: {
                      role: true,
                    },
                  },
                },
              },
              createdBy: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                  role: true,
                },
              },
            },
          },
        },
      },
      kanbanColumns: {
        where: { archived: false },
        orderBy: { order: 'asc' },
        include: {
          tasks: {
            where: { archived: false },
            include: {
              goal: {
                select: {
                  title: true,
                },
              },
              assignedTo: {
                include: {
                  teamMemberships: {
                    select: {
                      role: true,
                    },
                  },
                },
              },
              createdBy: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                  role: true,
                },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      },
    },
  },
);

export type ProjectDetail = Prisma.ProjectGetPayload<typeof projectDetailQuery>;

export type KanbanColumn = Prisma.KanbanColumnGetPayload<{
  include: {
    tasks: {
      where: { archived: false };
      include: {
        goal: {
          select: {
            title: true;
          };
        };
        assignedTo: {
          include: {
            teamMemberships: {
              select: {
                role: true;
              };
            };
          };
        };
        createdBy: {
          select: {
            id: true;
            name: true;
            email: true;
            image: true;
            role: true;
          };
        };
      };
    };
  };
}>;

export type Task = Prisma.TaskGetPayload<{
  include: {
    goal: {
      select: {
        title: true;
      };
    };
    assignedTo: {
      include: {
        teamMemberships: {
          select: {
            role: true;
          };
        };
      };
    };
    createdBy: {
      select: {
        id: true;
        name: true;
        email: true;
        image: true;
        role: true;
      };
    };
  };
}>;

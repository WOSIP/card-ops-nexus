import React, { createContext, useContext, useState, ReactNode } from "react";
import { Operator, PosTerminal, Project } from "@/types";

interface ManagementContextType {
  operators: Operator[];
  terminals: PosTerminal[];
  projects: Project[];
  linkOperatorToPos: (operatorId: string, posId: string) => void;
  unlinkOperatorFromPos: (posId: string) => void;
  updateOperator: (operator: Operator) => void;
  createOperator: (operator: Operator) => void;
  deleteOperator: (id: string) => void;
  updateTerminal: (terminal: PosTerminal) => void;
  createTerminal: (terminal: PosTerminal) => void;
  deleteTerminal: (id: string) => void;
  updateProject: (project: Project) => void;
  createProject: (project: Project) => void;
  deleteProject: (id: string) => void;
}

const ManagementContext = createContext<ManagementContextType | undefined>(undefined);

const initialMockOperators: Operator[] = [
  {
    id: "op1",
    name: "Elena Rodriguez",
    email: "elena.r@cardportal.com",
    phone: "+251 911 223 344",
    role: "Supervisor",
    status: "Active",
    cardsDistributed: 1240,
    avatarUrl: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/9bebb232-52b9-43a5-91c2-4eec251cb773/operator-1-4a1c503c-1775420726687.webp",
    posId: "pos1",
    posName: "Main Mall Terminal"
  },
  {
    id: "op2",
    name: "Marcus Chen",
    email: "m.chen@cardportal.com",
    phone: "+251 911 556 677",
    role: "Operator",
    status: "Active",
    cardsDistributed: 842,
    avatarUrl: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/9bebb232-52b9-43a5-91c2-4eec251cb773/operator-2-ec7c7d6e-1775420727065.webp"
  },
  {
    id: "op3",
    name: "Sarah Jenkins",
    email: "s.jenkins@cardportal.com",
    phone: "+251 911 889 900",
    role: "Operator",
    status: "Inactive",
    cardsDistributed: 210,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  },
  {
    id: "op4",
    name: "David Smith",
    email: "d.smith@cardportal.com",
    phone: "+251 911 001 122",
    role: "Operator",
    status: "Active",
    cardsDistributed: 530,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=David"
  }
];

const initialProjects: Project[] = [
  {
    id: "p1",
    name: "Global Rewards Program",
    description: "Multi-national reward point card system for frequent travelers.",
    status: "Active",
    totalCards: 5000,
    deployedCards: 3420,
    startDate: "2024-01-01"
  },
  {
    id: "p2",
    name: "Eco-Transit System",
    description: "Sustainable public transport payment solution using RFID cards.",
    status: "Active",
    totalCards: 10000,
    deployedCards: 8200,
    startDate: "2023-10-15"
  },
  {
    id: "p3",
    name: "National Student Grant",
    description: "Financial aid distribution for university students across the country.",
    status: "Draft",
    totalCards: 2000,
    deployedCards: 0,
    startDate: "2024-06-01"
  }
];

const initialPOS: PosTerminal[] = [
  { 
    id: "pos1", 
    name: "Main Mall Terminal",
    serialNumber: "TID-90421", 
    cardIdentity: "5105 8421 7732 9042",
    phoneNumber: "+251 911 222 333",
    location: "Central Mall - South Wing", 
    status: "Online", 
    lastPing: "Just now", 
    totalTransactions: 1242,
    operatorId: "op1",
    operatorName: "Elena Rodriguez",
    projectId: "p1",
    projectName: "Global Rewards Program"
  },
  { 
    id: "pos2", 
    name: "Metro Kiosk A",
    serialNumber: "TID-88210", 
    cardIdentity: "4532 1102 9943 8821",
    phoneNumber: "+251 911 444 555",
    location: "Metro Station - Line 1", 
    status: "Online", 
    lastPing: "2m ago", 
    totalTransactions: 8432,
    projectId: "p2",
    projectName: "Eco-Transit System"
  },
  { 
    id: "pos3", 
    name: "Airport Arrival #2",
    serialNumber: "TID-44122", 
    cardIdentity: "5412 0032 5521 4412",
    phoneNumber: "+251 911 666 777",
    location: "Airport Arrival - T2", 
    status: "Offline", 
    lastPing: "4h ago", 
    totalTransactions: 2105,
    projectId: "p1",
    projectName: "Global Rewards Program"
  },
  { 
    id: "pos4", 
    name: "Campus Cafe Pos",
    serialNumber: "TID-77231", 
    cardIdentity: "4000 8821 3342 7723",
    phoneNumber: "+251 911 888 999",
    location: "University Cafeteria", 
    status: "Maintenance", 
    lastPing: "1d ago", 
    totalTransactions: 450,
  },
];

export const ManagementProvider = ({ children }: { children: ReactNode }) => {
  const [operators, setOperators] = useState<Operator[]>(initialMockOperators);
  const [terminals, setTerminals] = useState<PosTerminal[]>(initialPOS);
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const linkOperatorToPos = (operatorId: string, posId: string) => {
    const operator = operators.find(o => o.id === operatorId);
    const terminal = terminals.find(t => t.id === posId);

    if (!operator || !terminal) return;

    // Bidirectional update
    setOperators(prev => prev.map(op => 
      op.id === operatorId ? { ...op, posId, posName: terminal.name } : op
    ));

    setTerminals(prev => prev.map(t => 
      t.id === posId ? { ...t, operatorId, operatorName: operator.name } : t
    ));
  };

  const unlinkOperatorFromPos = (posId: string) => {
    const terminal = terminals.find(t => t.id === posId);
    if (!terminal) return;

    const opId = terminal.operatorId;

    setTerminals(prev => prev.map(t => 
      t.id === posId ? { ...t, operatorId: undefined, operatorName: undefined } : t
    ));

    if (opId) {
      setOperators(prev => prev.map(op => 
        op.id === opId ? { ...op, posId: undefined, posName: undefined } : op
      ));
    }
  };

  const updateOperator = (operator: Operator) => {
    setOperators(prev => prev.map(o => o.id === operator.id ? operator : o));
  };

  const createOperator = (operator: Operator) => {
    setOperators(prev => [operator, ...prev]);
  };

  const deleteOperator = (id: string) => {
    setOperators(prev => prev.filter(o => o.id !== id));
  };

  const updateTerminal = (terminal: PosTerminal) => {
    setTerminals(prev => prev.map(t => t.id === terminal.id ? terminal : t));
  };

  const createTerminal = (terminal: PosTerminal) => {
    setTerminals(prev => [terminal, ...prev]);
  };

  const deleteTerminal = (id: string) => {
    setTerminals(prev => prev.filter(t => t.id !== id));
  };

  const updateProject = (project: Project) => {
    setProjects(prev => prev.map(p => p.id === project.id ? project : p));
    // Update terminal project names if name changed
    setTerminals(prev => prev.map(t => 
      t.projectId === project.id ? { ...t, projectName: project.name } : t
    ));
  };

  const createProject = (project: Project) => {
    setProjects(prev => [project, ...prev]);
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    // Remove project reference from terminals
    setTerminals(prev => prev.map(t => 
      t.projectId === id ? { ...t, projectId: undefined, projectName: undefined } : t
    ));
  };

  return (
    <ManagementContext.Provider value={{
      operators,
      terminals,
      projects,
      linkOperatorToPos,
      unlinkOperatorFromPos,
      updateOperator,
      createOperator,
      deleteOperator,
      updateTerminal,
      createTerminal,
      deleteTerminal,
      updateProject,
      createProject,
      deleteProject
    }}>
      {children}
    </ManagementContext.Provider>
  );
};

export const useManagement = () => {
  const context = useContext(ManagementContext);
  if (context === undefined) {
    throw new Error("useManagement must be used within a ManagementProvider");
  }
  return context;
};
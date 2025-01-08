import React from "react";

const MyProposalsPage: React.FC = () => {
  // Static data for now, replace with API integration later
  const proposals = [
    { id: 1, title: "Proposal 1", description: "Description for proposal 1" },
    { id: 2, title: "Proposal 2", description: "Description for proposal 2" },
    { id: 3, title: "Proposal 3", description: "Description for proposal 3" },
  ];

  return (
    <div>
      <h1>My Proposals</h1>
      <ul>
        {proposals.map((proposal) => (
          <li key={proposal.id}>
            <h2>{proposal.title}</h2>
            <p>{proposal.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyProposalsPage;

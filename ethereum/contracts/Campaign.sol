// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.9;

contract CampaignFactory {
    Campaign[] public deployedCampaigns;

    function createCampaign(uint256 minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;
    uint256 public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint256 minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string memory description,
        uint256 value,
        address payable recipient
    ) public restricted {
        // creates a new instance of type Request
        Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint256 index) public {
        Request storage request = requests[index];

        // check if user has donated to campaign
        require(approvers[msg.sender]);
        // check if user has already approved
        require(!requests[index].approvals[msg.sender]);

        // approve the request
        request.approvals[msg.sender] = true;
        // increment the number of approvals
        request.approvalCount++;
    }

    function finalizeRequest(uint256 index) public restricted {
        // get the current request
        Request storage request = requests[index];

        // check whether half of the contributors have approved the request
        require(request.approvalCount > (approversCount / 2));
        // check whether the request has been finalized already
        require(!request.complete);

        // send the money to the recipient/supplier
        request.recipient.transfer(request.value);
        // finalize the request
        request.complete = true;
    }

    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return requests.length;
    }
}

import React from "react";
import Layout from "../components/Layout";
import UserList from "../components/UserList";
import AddUser from "../components/AddUser";

const AffiliateMembers = () => {
    return (
        <Layout>
            <div className="container mx-auto my-8 p-4 flex flex-col items-center">
                <h1 className="text-2xl font-semibold mb-6 text-center">Affiliate Members</h1>
                <div className="w-full max-w-4xl">
                    <AddUser />
                    {/*<UserList />*/}
                </div>
            </div>
        </Layout>
    );
};

export default AffiliateMembers;

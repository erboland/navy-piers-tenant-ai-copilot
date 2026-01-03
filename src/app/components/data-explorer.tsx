import * as React from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import {
  mockFinancialData,
  mockLegalClauses,
  mockComplianceRecords,
  mockOperationalDetails,
  mockVendors,
} from "../lib/mock-data";

interface DataExplorerProps {
  vendorId: string;
}

export function DataExplorer({ vendorId }: DataExplorerProps) {
  const vendor = mockVendors.find((v) => v.id === vendorId);

  if (!vendor) {
    return (
      <div className="container max-w-7xl mx-auto p-6">
        <p className="text-muted-foreground">
          Please select a vendor to view data
        </p>
      </div>
    );
  }

  const financialData = mockFinancialData.find((f) => f.vendor === vendor.name);
  const legalClauses = mockLegalClauses.filter((l) => l.vendor === vendor.name);
  const complianceRecords = mockComplianceRecords.filter(
    (c) => c.vendor === vendor.name
  );
  const operationalDetails = mockOperationalDetails.filter(
    (o) => o.vendor === vendor.name
  );

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="scroll-m-20 text-3xl tracking-tight">
          Data Explorer
        </h2>
        <p className="text-muted-foreground">
          Structured view of {vendor.name} data
        </p>
      </div>

      <Separator />

      <Tabs defaultValue="financial" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="operational">Operational</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-4 mt-6">
          {financialData ? (
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>
                  Revenue and rent information for {vendor.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Total Revenue (2025)
                    </p>
                    <p className="scroll-m-20 text-4xl tracking-tight">
                      ${(financialData.revenue / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Base Rent</p>
                    <p className="scroll-m-20 text-4xl tracking-tight">
                      ${financialData.baseRent.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">per month</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Percentage Rent (2025)
                    </p>
                    <p className="scroll-m-20 text-4xl tracking-tight">
                      ${financialData.percentageRent.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Payment Status
                    </p>
                    <Badge variant="default" className="text-base px-3 py-1">
                      {financialData.paymentStatus}
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Last Payment Date
                  </p>
                  <p className="text-xl">{new Date(financialData.lastPaymentDate).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  No financial data available for this vendor
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="legal" className="space-y-4 mt-6">
          <div className="grid gap-4">
            {legalClauses.length > 0 ? (
              legalClauses.map((clause) => (
                <Card key={clause.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <CardTitle>{clause.clauseType}</CardTitle>
                        <CardDescription>{clause.description}</CardDescription>
                      </div>
                      {clause.requiresAction && (
                        <Badge variant="destructive">Action Required</Badge>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">
                    No legal clauses data available
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4 mt-6">
          <div className="grid gap-4">
            {complianceRecords.length > 0 ? (
              complianceRecords.map((record) => (
                <Card key={record.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        <CardTitle>{record.documentType}</CardTitle>
                        <CardDescription>
                          Issued by: {record.issuingAuthority}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          record.status === "Current"
                            ? "default"
                            : record.status === "Expiring Soon"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {record.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">
                        Expiration Date:
                      </span>
                      <span className="font-medium">
                        {new Date(record.expirationDate).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">
                    No compliance records available
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="operational" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {operationalDetails.length > 0 ? (
              operationalDetails.map((detail) => (
                <Card key={detail.id}>
                  <CardHeader>
                    <CardTitle>{detail.category}</CardTitle>
                    <CardDescription>{detail.detail}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="scroll-m-20 text-2xl tracking-tight">{detail.value}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-2">
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">
                    No operational details available
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
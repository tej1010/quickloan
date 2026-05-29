import PageBreadcrumb from "../common/PageBreadCrumb";

interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <PageBreadcrumb pageTitle={title} />
      {actions}
    </div>
  );
}

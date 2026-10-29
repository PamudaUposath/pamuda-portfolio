// SEO Component - Manages meta tags for better search engine optimization
import { Helmet } from "react-helmet-async";
import { siteConfig } from "../data/siteConfig";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string[];
}

export const SEO: React.FC<SEOProps> = ({
  title = "Pamuda - Portfolio",
  description = siteConfig.tagline,
  image = "/og-image.jpg", // You'll need to add this image to public folder
  url = "https://pamudauposath.github.io/portfolio/",
  type = "website",
  keywords = [
    "Pamuda Goonatilake",
    "Cloud Engineer",
    "DevOps Engineer",
    "Site Reliability Engineering",
    "SRE",
    "AWS Student Builder Group Leader",
    "University of Jaffna",
    "Cloud Computing",
    "AWS",
    "Kubernetes",
    "Docker",
    "Terraform",
    "Ansible",
    "Argo CD",
    "GitOps",
    "Microservices Reliability",
    "Infrastructure Automation",
    "Software Engineering Sri Lanka",
    "IEEE",
    "Portfolio",
  ],
}) => {
  const fullImageUrl = image.startsWith("http") ? image : `${url}${image.replace(/^\//, "")}`;
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name="author" content={siteConfig.name} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />
      <meta property="twitter:creator" content="@goonatilakeP" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#ff7300" />
      <meta name="msapplication-TileColor" content="#ff7300" />
      
      {/* LinkedIn */}
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="article:author" content={siteConfig.social.linkedin} />
      
      {/* Schema.org structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: siteConfig.name,
          url: url,
          image: fullImageUrl,
          jobTitle: siteConfig.title,
          description: description,
          email: siteConfig.email,
          telephone: siteConfig.phone,
          address: {
            "@type": "PostalAddress",
            addressLocality: siteConfig.location,
          },
          sameAs: [
            siteConfig.social.github,
            siteConfig.social.linkedin,
            siteConfig.social.twitter,
            siteConfig.social.instagram,
            siteConfig.social.medium,
            siteConfig.social.youtube,
            siteConfig.social.devto,
            siteConfig.social.hashnode,
            siteConfig.social.awsBuilderCenter,
          ].filter(Boolean),
        })}
      </script>
    </Helmet>
  );
};

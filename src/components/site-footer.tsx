import { siteConfig } from "@/lib/content";
import { defaultLocale, t, type Locale } from "@/lib/i18n";
import { BRAND_NAME } from "@/lib/config";
import Link from "next/link";


type SiteFooterProps = {
  locale?: Locale;
};


export function SiteFooter({
  locale = defaultLocale,
}: SiteFooterProps) {


  return (

    <footer className="site-footer">

      <div className="container footer-grid">


        <div>

          <h2 className="footer-title">
            {BRAND_NAME}
          </h2>


          <p>
            {t(locale,"footerTagline")}
          </p>


          <p className="muted">
            mauritech.tech
          </p>


          <p className="muted">
            {t(locale,"footerSupportPromise")}
          </p>


        </div>




        <div>

          <h3 className="footer-heading">
            {t(locale,"footerContact")}
          </h3>


          <ul className="footer-list">


            <li>
              <a href={`tel:${siteConfig.phone}`}>
                {siteConfig.phone}
              </a>
            </li>


            <li>
              <a href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
            </li>


            <li>
              {siteConfig.officeHours}
            </li>


            <li>
              {siteConfig.responseTime}
            </li>


          </ul>


        </div>





        <div>


          <h3 className="footer-heading">
            {t(locale,"footerNavigate")}
          </h3>



          <ul className="footer-list">


            <li>
              <Link href={`/${locale}/services`}>
                {t(locale,"navServices")}
              </Link>
            </li>



            <li>
              <Link href={`/${locale}/projects`}>
                {t(locale,"navProjects")}
              </Link>
            </li>



            <li>
              <Link href={`/${locale}/portal-access`}>
                {t(locale,"navPortal")}
              </Link>
            </li>



            <li>
              <Link href={`/${locale}/contact`}>
                {t(locale,"navContactLink")}
              </Link>
            </li>



          </ul>


        </div>



      </div>


    </footer>

  );

}

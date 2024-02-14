import './index.css'
import {BsBriefcaseFill} from 'react-icons/bs'
import {IoLocationSharp} from 'react-icons/io5'
import {Link} from 'react-router-dom'
import {FaExternalLinkAlt, FaStar} from 'react-icons/fa'

const SearchResult = props => {
  const {details} = props
  const {
    id,
    title,
    rating,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
  } = details

  return (
    <Link to={`/jobs/${id}`} className="item-link">
      <li className="job-item">
        <div className="div-flex-row">
          <img src={companyLogoUrl} alt="company logo" className="sr-logo" />
          <div className="sr-div1">
            <h1 className="">{title}</h1>
            <div className="div-flex-row ">
              <FaStar className="star-icon" />
              <p className="m0p0">{rating}</p>
            </div>
          </div>
        </div>
        <div className="div-flex-row loc-div">
          <div className="div-flex-row">
            <div className="div-flex-row bg-white">
              <IoLocationSharp className="mr-10" />
              <p className="m0p0 sr-loc-p1 ">{location}</p>
            </div>
            <div className="div-flex-row bg-white">
              <BsBriefcaseFill className="ml-20 mr-10" />
              <p className="m0p0 sr-loc-p1 ">{employmentType}</p>
            </div>
          </div>
          <div className="bg-white">
            <p>{packagePerAnnum}</p>
          </div>
        </div>
        <hr />
        <div>
          <h1 className="body-heading">Description</h1>
          <p>{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}
export default SearchResult

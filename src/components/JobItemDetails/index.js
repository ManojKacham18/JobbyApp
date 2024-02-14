import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaStar, FaExternalLinkAlt} from 'react-icons/fa'
import {BsBriefcaseFill} from 'react-icons/bs'
import {IoLocationSharp} from 'react-icons/io5'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'
import Header from '../Header'

class JobItemDetails extends Component {
  state = {jobData: {}, isLoading: 0, similarItems: []}

  componentDidMount() {
    this.getBlogItemData()
  }

  convertSnakeToCamel = obj =>
    Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (match, group) =>
        group.toUpperCase(),
      )
      acc[camelKey] = obj[key]
      return acc
    }, {})

  getBlogItemData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    const data = await response.json()
    if (response.ok) {
      const updatedData = data
      console.log(data)
      console.log(data.job_details)
      this.setState({
        jobData: data.job_details,
        similarItems: data.similar_jobs,
        isLoading: 1,
      })
    } else {
      console.log(response)
      this.setState({isLoading: 2})
    }
  }

  renderBlogItemDetails = () => {
    const {jobData, similarItems} = this.state
    console.log(similarItems)
    return (
      <div className="jid-main-div">
        <div className="jid-div-2">
          <div className="div-flex-row">
            <img
              src={jobData.company_logo_url}
              alt="job details company logo"
              className="sr-logo"
            />
            <div className="sr-div1">
              <h1 className="m0p0">{jobData.title}</h1>
              <div className="div-flex-row">
                <FaStar className="star-icon" />
                <p className="m0p0">{jobData.rating}</p>
              </div>
            </div>
          </div>
          <div className="div-flex-row loc-div">
            <div className="div-flex-row">
              <div className="div-flex-row bg-white">
                <IoLocationSharp className="mr-10" />
                <p className="m0p0 sr-loc-p1 ">{jobData.location}</p>
              </div>
              <div className="div-flex-row bg-white">
                <BsBriefcaseFill className="ml-20 mr-10" />
                <p className="m0p0 sr-loc-p1 ">{jobData.employment_type}</p>
              </div>
            </div>
            <p>{jobData.package_per_annum}</p>
          </div>
          <hr />
          <div>
            <div className="div-flex-row jid-div2">
              <h1 className="desH">Description</h1>
              <a
                href={jobData.company_website_url}
                className="href-ele div-flex-row"
              >
                <p>Visit</p>
                <FaExternalLinkAlt />
              </a>
            </div>
            <p>{jobData.job_description}</p>
          </div>
          <div>
            <h1 className="desH">Skills</h1>
            <ul className="skills-ul">
              {jobData.skills.map(eachItem => (
                <li className="div-flex-row w-33" key={eachItem.name}>
                  <img
                    src={eachItem.image_url}
                    className="jid-img3"
                    alt={eachItem.name}
                  />
                  <p>{eachItem.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h1 className="desH">Life at Company</h1>
            <div className="div-flex-row ">
              <div className="w-60 lacdiv1">
                <p className="lacP">{jobData.life_at_company.description}</p>
              </div>
              <div className="w-40">
                <img
                  src={jobData.life_at_company.image_url}
                  className="lic-img"
                  alt="life at company"
                />
              </div>
            </div>
          </div>
        </div>
        <h1>Similar Jobs</h1>
        <ul className="skills-ul">
          {similarItems.map(eachItem => (
            <li className="similar-jobs-maindiv" key={eachItem.title}>
              <div className="div-flex-row">
                <img
                  src={eachItem.company_logo_url}
                  alt="similar job company logo"
                  className="sr-logo"
                />
                <div className="sr-div1">
                  <h1 className="m0p0">{eachItem.title}</h1>
                  <div className="div-flex-row">
                    <FaStar className="star-icon" />
                    <p className="m0p0">{eachItem.rating}</p>
                  </div>
                </div>
              </div>
              <h1 className="desH">Description</h1>
              <p>{eachItem.job_description}</p>
              <div className="div-flex-row loc-div">
                <div className="div-flex-row">
                  <div className="div-flex-row bg-white">
                    <IoLocationSharp className="mr-10" />
                    <p className="m0p0 sr-loc-p1 ">{eachItem.location}</p>
                  </div>
                  <div className="div-flex-row bg-white">
                    <BsBriefcaseFill className="ml-20 mr-10" />
                    <p className="m0p0 sr-loc-p1 ">
                      {eachItem.employment_type}
                    </p>
                  </div>
                </div>
                <div className="bg-white">
                  <p>{eachItem.package_per_annum}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  render() {
    const {isLoading, jobData} = this.state
    let content2

    if (isLoading === 1) {
      content2 = this.renderBlogItemDetails()
    } else if (isLoading === 0) {
      content2 = (
        <div className="products-loader-container loader" data-testid="loader">
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
      )
    } else {
      content2 = (
        <div className="retry-btn-div">
          <img
            src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            alt="failure view"
            className="noJobsImg"
          />
          <h1 className="njH">Oops? Something Went Wrong</h1>
          <p className="home-description">
            We cannot seem to find the page you are looking for
          </p>
          <button
            onClick={this.getBlogItemData}
            type="button"
            className="logout-desktop-btn"
          >
            Retry
          </button>
        </div>
      )
    }

    return (
      <div className="job-item-container">
        <Header />
        {content2}
      </div>
    )
  }
}

export default JobItemDetails

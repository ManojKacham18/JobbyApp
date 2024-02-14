import './index.css'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'

import SearchResult from '../SearchResult'
import Header from '../Header'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class JobsPage extends Component {
  state = {
    JobsList: [],
    profileDetails: {},
    profileStatus: '',
    jobsStatus: '',
    searchInp: '',
    TOE: [],
    sR: '',
  }

  componentDidMount() {
    this.profileDetails()
    this.getJobsList()
  }

  convertSnakeToCamel = obj =>
    Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (match, group) =>
        group.toUpperCase(),
      )
      acc[camelKey] = obj[key]
      return acc
    }, {})

  apiFetching = url => {}

  getJobsList = async () => {
    this.setState({
      jobsStatus: 0,
    })
    const {TOE, searchInp, sR} = this.state
    let toeString = ''
    TOE.forEach(each => {
      toeString = `${toeString}${each},`
    })
    toeString = toeString.slice(0, toeString.length - 1)
    console.log(toeString)
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${toeString}&minimum_package=${sR}&search=${searchInp}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(this.convertSnakeToCamel)
      console.log(updatedData)
      this.setState({
        JobsList: updatedData,
        jobsStatus: 1,
      })
    } else {
      this.setState({jobsStatus: 2})
    }
  }

  profileDetails = async () => {
    this.setState({
      profileStatus: 0,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/profile`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.convertSnakeToCamel(fetchedData.profile_details)
      // console.log(updatedData)
      this.setState({
        profileDetails: updatedData,
        profileStatus: 1,
      })
    } else {
      this.setState({profileStatus: 2})
    }
  }

  onRetry = () => {
    this.profileDetails()
  }

  onRetry2 = () => {
    this.getJobsList()
  }

  inpChange = e => {
    this.setState({searchInp: e.target.value})
  }

  onClickSearch = () => {
    this.getJobsList()
  }

  renderLoader = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProfile = () => {
    const {profileDetails, profileStatus} = this.state
    if (profileStatus === 1) {
      return (
        <div className="pfDiv">
          <img
            src={profileDetails.profileImageUrl}
            alt="profile"
            className="pf-img"
          />
          <h1 className="pfH">{profileDetails.name}</h1>
          <p className="pfP">{profileDetails.shortBio}</p>
        </div>
      )
    }
    return (
      <button className="retry-btn" onClick={this.onRetry}>
        Retry
      </button>
    )
  }

  renderProductsList = () => {
    const {JobsList, jobsStatus} = this.state
    if (jobsStatus === 1) {
      if (JobsList.length === 0) {
        return (
          <div className="abc">
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
              className="noJobsImg"
            />
            <h1 className="njH">No Jobs Found</h1>
            <p className="home-description">
              We could not find any jobs. Try other filters.
            </p>
          </div>
        )
      }
      return (
        <ul className="jobsList">
          {JobsList.map(each => (
            <SearchResult key={each.id} details={each} />
          ))}
        </ul>
      )
    }
    return (
      <div className="abc">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="noJobsImg"
        />
        <h1 className="njH">Oops? Something Went Wrong</h1>
        <p className="home-description">
          We cannot seem to find the page you are looking for
        </p>
        <button className="retry-btn" onClick={this.onRetry2}>
          Retry
        </button>
      </div>
    )
  }

  toeFun = e => {
    const {TOE} = this.state
    let a = TOE
    if (TOE.includes(e.target.value)) {
      a = TOE.filter(each => each !== e.target.value)
    } else {
      a.push(e.target.value)
    }
    this.setState({TOE: a}, this.getJobsList)
  }

  salChange = e => {
    this.setState({sR: e.target.value}, this.getJobsList)
  }

  render() {
    const {profileStatus, jobsStatus} = this.state
    return (
      <div className="bg-container">
        <Header />
        <div className="jp-bg-container">
          <div className="filters-section">
            <div className="profile-cont">
              {profileStatus === 0 ? this.renderLoader() : this.renderProfile()}
            </div>
            <hr className="hr" />
            <h1 className="fcH">Type of Employment</h1>
            <ul className="toeList">
              {employmentTypesList.map(each => (
                <li className="toeListItem" key={each.employmentTypeId}>
                  <input
                    className="inp1"
                    type="checkbox"
                    onChange={this.toeFun}
                    id={each.employmentTypeId}
                    value={each.employmentTypeId}
                  />
                  <label className="label1" htmlFor={each.employmentTypeId}>
                    {each.label}
                  </label>
                </li>
              ))}
            </ul>
            <hr className="hr" />
            <h1 className="fcH">Salary Range</h1>
            <ul className="toeList">
              {salaryRangesList.map(each => (
                <li key={each.salaryRangeId} className="toeListItem">
                  <input
                    type="radio"
                    value={each.salaryRangeId}
                    name="salaryRange"
                    id={each.salaryRangeId}
                    className="inp1"
                    onChange={this.salChange}
                  />
                  <label className="label1" htmlFor={each.salaryRangeId}>
                    {each.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="part2cont">
            <div className="searchDiv">
              <input
                type="search"
                placeholder="Search"
                onChange={this.inpChange}
                className="searchInp"
              />
              <button
                onClick={this.onClickSearch}
                data-testid="searchButton"
                className="searchIconDiv"
              >
                <BsSearch id="1" className="searchIcon" />
                <label className="labl" htmlFor="1">
                  search
                </label>
              </button>
            </div>
            <div className="part2Cont2">
              {jobsStatus === 0
                ? this.renderLoader()
                : this.renderProductsList()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default JobsPage

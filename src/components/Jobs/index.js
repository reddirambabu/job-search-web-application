import {Component} from 'react'
import {BiSearchAlt2} from 'react-icons/bi'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import JobCardItemDetails from '../JobCardItemDetails'
import Header from '../Header'
import UserProfileSection from '../UserProfileSection'
import FilterGroup from '../FilterGroup'

import './index.css'

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

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    searchInput: '',
    activeEmploymentType: '',
    activeSalaryRange: '',
    apiStatus: apiStatusConstants.initial,
    allJobsList: [],
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    const {searchInput, activeEmploymentType, activeSalaryRange} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const accessToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${activeEmploymentType}&minimum_package=${activeSalaryRange}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const formattedData = data.jobs.map(eachJobCard => ({
        companyLogoUrl: eachJobCard.company_logo_url,
        employmentType: eachJobCard.employment_type,
        id: eachJobCard.id,
        jobDescription: eachJobCard.job_description,
        location: eachJobCard.location,
        packagePerAnnum: eachJobCard.package_per_annum,
        rating: eachJobCard.rating,
        title: eachJobCard.title,
      }))
      console.log(formattedData)

      this.setState({
        allJobsList: formattedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {allJobsList} = this.state
    const isDataAvailable = allJobsList.length > 0
    return isDataAvailable ? (
      <ul>
        {allJobsList.map(eachJobDetails => (
          <JobCardItemDetails
            key={eachJobDetails.id}
            eachJobCard={eachJobDetails}
          />
        ))}
      </ul>
    ) : (
      <div className="no-jobs-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="not-found-image"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobDetails()
    }
  }

  renderSearchField = () => {
    const {searchInput} = this.state
    return (
      <div className="search-container">
        <input
          type="search"
          value={searchInput}
          className="search-input"
          onChange={this.onChangeSearchInput}
          placeholder="Search"
          onKeyDown={this.onEnterSearchInput}
        />
        <BiSearchAlt2 className="search-icon" />
      </div>
    )
  }

  changeEmploymentType = activeId => {
    this.setState({activeEmploymentType: activeId})
  }

  changeSalaryRange = activeId => {
    this.setState({activeSalaryRange: activeId})
  }

  renderLoadingSectionView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="loader-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="not-found-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p className="not-found-description">
        We cannot seem to find page you are looking for.
      </p>
    </div>
  )

  renderJobDetailsViewCardsStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingSectionView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {activeEmploymentType, activeSalaryRange} = this.state
    return (
      <div>
        <Header />
        <div className="jobs-container">
          {this.renderSearchField()}
          <div className="filter-group-section">
            <UserProfileSection />
            <hr className="horizontal-line" />
            <FilterGroup
              employmentTypesList={employmentTypesList}
              activeEmploymentType={activeEmploymentType}
              changeEmploymentType={this.changeEmploymentType}
              salaryRangesList={salaryRangesList}
              activeSalaryRange={activeSalaryRange}
              changeSalaryRange={this.changeSalaryRange}
            />
          </div>
          {this.renderJobDetailsViewCardsStatus()}
        </div>
      </div>
    )
  }
}

export default Jobs

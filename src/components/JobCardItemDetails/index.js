import './index.css'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'

import {Link} from 'react-router-dom'

const JobCardItemDetails = props => {
  const {eachJobCard} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = eachJobCard

  return (
    <Link to={`/jobs/:${id}`}>
      <li>
        <div>
          <img src={companyLogoUrl} alt={title} />
          <div>
            <h1>{title}</h1>
            <div>
              <AiFillStar />
              <span>{rating}</span>
            </div>
          </div>
        </div>

        <div>
          <div>
            <div>
              <MdLocationOn />
              <p>{location}</p>
            </div>
            <div>
              <BsFillBriefcaseFill />
              <p>{employmentType}</p>
            </div>
          </div>
          <p>{packagePerAnnum}</p>
        </div>

        <hr />

        <p>{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobCardItemDetails
